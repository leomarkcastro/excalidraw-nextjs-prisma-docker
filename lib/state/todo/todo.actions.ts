import axios from 'axios';
import {
  Action,
  Computed,
  Thunk,
  action,
  computed,
  persist,
  thunk,
} from 'easy-peasy';
import { Todo } from './todo.types';

export interface TodosModel {
  todos: Todo[];
  completedTodos: Computed<TodosModel, Todo[]>;
  addTodo: Action<TodosModel, Todo>;
  saveTodo: Thunk<TodosModel, Todo>;
}

export const todoStore: TodosModel = persist({
  todos: [],
  completedTodos: computed((state) => state.todos.filter((todo) => todo.done)),
  addTodo: action((state, payload) => {
    state.todos.push(payload);
  }),
  saveTodo: thunk(async (actions, payload) => {
    const result = await axios.post('/todos', payload);
    actions.addTodo(result.data);
  }),
});
