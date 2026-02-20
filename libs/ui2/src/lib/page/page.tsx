import { PageContent, PageContentProps } from './components/page-content';
import { PageShadow } from './components/page-shadow';

export const Page = ({ ...pageContentProps }: PageContentProps) => {
  return (
    <>
      <PageContent {...pageContentProps} />
      <PageShadow />
    </>
  );
};
