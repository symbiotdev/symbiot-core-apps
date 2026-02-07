import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { ThemeProvider } from '@symbiot-core-apps/theme';
import {
  AppSettings,
  useAppDetailsReq,
  useAppSettingsOverridesReq,
} from '@symbiot-core-apps/api';
import { useI18n } from '@symbiot-core-apps/shared';
import merge from 'deepmerge';
import { useAppState } from '../hooks/use-app-state';
import { MandatoryUpdate } from '../components/mandatory-update';
import { Platform } from 'react-native';
import { useAppVersionUpdateType } from '../hooks/use-app-version-update-type';
import { hideAsync } from 'expo-splash-screen';

const Context = createContext<AppSettings | undefined>(undefined);

export const useAppSettings = () => useContext(Context) as AppSettings;

export const AppProvider = ({
  children,
  defaultSettings,
}: PropsWithChildren<{ defaultSettings: AppSettings }>) => {
  const { updateTranslates } = useI18n();
  const { data: appDetails } = useAppDetailsReq();
  const appUpdateType = useAppVersionUpdateType();
  const { data: remoteSettings, error: remoteSettingsError } =
    useAppSettingsOverridesReq();
  const { overriddenSettings, setOverriddenSettings, setVersionDetails } =
    useAppState();

  const loadedRef = useRef(false);

  const adjustedAppSettings = useMemo(
    () => merge(defaultSettings, overriddenSettings),
    [defaultSettings, overriddenSettings],
  );

  const loaded = useMemo(
    () =>
      loadedRef.current ||
      !!remoteSettings ||
      !!remoteSettingsError ||
      !!Object.keys(overriddenSettings).length,
    [remoteSettings, remoteSettingsError, overriddenSettings],
  );

  useEffect(() => {
    const versionDetails = appDetails?.version?.[Platform.OS];

    if (versionDetails) setVersionDetails(versionDetails);
  }, [appDetails, setVersionDetails]);

  useLayoutEffect(() => {
    if (!remoteSettings) return;

    setOverriddenSettings(remoteSettings);
    loadedRef.current = true;
  }, [remoteSettings, setOverriddenSettings]);

  useLayoutEffect(() => {
    if (overriddenSettings?.language?.translations)
      updateTranslates(overriddenSettings.language.translations);
  }, [overriddenSettings, updateTranslates]);

  useLayoutEffect(() => {
    appUpdateType === 'mandatory' && hideAsync();
  }, [appUpdateType]);

  return (
    <Context.Provider value={adjustedAppSettings}>
      <KeyboardProvider>
        {loaded && (
          <ThemeProvider theme={adjustedAppSettings.theme}>
            {appUpdateType === 'mandatory' ? <MandatoryUpdate /> : children}
          </ThemeProvider>
        )}
      </KeyboardProvider>
    </Context.Provider>
  );
};
