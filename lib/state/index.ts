import { createStore, createTypedHooks } from 'easy-peasy';
import { TodosModel, todoStore } from './todo/todo.actions';

interface GlobalStoreType {
  todoStore: TodosModel;
}

const globalModel: GlobalStoreType = {
  todoStore,
};

const GlobalStore = createStore<GlobalStoreType>(globalModel);

const TypedGlobalStore = createTypedHooks<GlobalStoreType>();

export default GlobalStore;
export const useGlobalActions = TypedGlobalStore.useStoreActions;
export const useGlobalDispatch = TypedGlobalStore.useStoreDispatch;
export const useGlobalState = TypedGlobalStore.useStoreState;
