import { RenderPaginationList } from '../hooks/use-pagination-list-loader';

type EntityId = string | number;

export function mapByIdFromListWithEntities<Entity extends { id: EntityId }>(
  byId: Record<EntityId, Entity>,
  list: Pick<RenderPaginationList<Entity>, 'items'>,
) {
  return {
    ...byId,
    ...list.items.reduce(
      (obj, entity) => ({
        ...obj,
        [entity.id]: {
          ...byId[entity.id],
          ...entity,
        },
      }),
      {},
    ),
  };
}

export function mapByIdListWithIdsFromListWithEntities<
  ID extends string | number,
  Entity extends { id: EntityId },
>(
  id: ID,
  currentList: Record<ID, RenderPaginationList<ID>>,
  newList: RenderPaginationList<Entity>,
) {
  return {
    ...currentList,
    [id]: mapListWithIdsFromListWithEntities(newList),
  };
}

export function mapListWithIdsFromListWithEntities<
  ID,
  Entity extends { id: ID },
>(newList: RenderPaginationList<Entity>) {
  return {
    ...newList,
    items: newList.items.map(({ id }) => id),
  };
}

export function setOneById<Entity extends { id: EntityId }>(
  entity: Entity,
  byId: Record<EntityId, Entity>,
) {
  return {
    ...byId,
    [entity.id]: {
      ...byId[entity.id],
      ...entity,
    },
  };
}

export function setManyById<Entity extends { id: EntityId }>(
  entities: Entity[],
  byId: Record<EntityId, Entity>,
) {
  return {
    ...byId,
    ...entities.reduce(
      (obj, entity) => ({
        ...obj,
        [entity.id]: entity,
      }),
      {},
    ),
  };
}

export function omitById<Entity extends { id: EntityId }>(
  id: EntityId,
  byId: Record<EntityId, Entity>,
) {
  if (!byId[id]) {
    return byId;
  }

  const { [id]: _, ...rest } = byId;

  return rest;
}

export function removeOneFromByIdListWithIds<ID extends string | number>(
  targetId: ID,
  listId: ID,
  list: Record<ID, RenderPaginationList<ID>>,
) {
  return {
    ...list,
    [listId]: removeFromListWithIds(targetId, list[listId]),
  };
}

export function addOneToByIdListWithIds<ID extends string | number>(
  targetId: ID,
  listId: ID,
  list: Record<ID, RenderPaginationList<ID>>,
) {
  return {
    ...list,
    [listId]: addOneToListWithIds(targetId, list[listId]),
  };
}

export function addManyToByIdListWithIds<ID extends string | number>(
  ids: ID[],
  listId: ID,
  list: Record<ID, RenderPaginationList<ID>>,
) {
  return {
    ...list,
    [listId]: addManyToListWithIds(ids, list[listId]),
  };
}

export function removeFromListWithIds<ID extends string | number>(
  targetId: ID,
  list?: RenderPaginationList<ID>,
) {
  return (
    list && {
      ...list,
      items: list.items.filter((id) => id !== targetId),
      count: list.count - 1,
    }
  );
}

export function addOneToListWithIds<ID extends string | number>(
  targetId: ID,
  list?: RenderPaginationList<ID>,
) {
  return (
    list && {
      ...list,
      items: Array.from(new Set([targetId, ...list.items])),
      count: list.count + 1,
    }
  );
}

export function addManyToListWithIds<ID extends string | number>(
  ids: ID[],
  list?: RenderPaginationList<ID>,
) {
  return (
    list && {
      ...list,
      items: Array.from(new Set([...ids, ...list.items])),
      count: list.count + ids.length,
    }
  );
}
