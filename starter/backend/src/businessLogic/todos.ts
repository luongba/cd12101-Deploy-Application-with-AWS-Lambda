import { TodosAccess } from "./todosAcess";
import { AttachmentUtils } from "./attachmentUtils";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { createLogger } from "../utils/logger";
import * as uuid from "uuid";

const logger = createLogger("TodosAccess");
const attatchmentUtils = new AttachmentUtils();
const todosAccess = new TodosAccess();

export async function CreateTodo(
  newItem: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  logger.info("Call function CreateTodo");
  const todoId = uuid.v4();
  const createdAt = new Date().toISOString();
  const s3AttachUrl = attatchmentUtils.getAttachmentUrl(userId);
  const _newItem = {
    userId,
    todoId,
    createdAt,
    done: false,
    attachmentUrl: s3AttachUrl,
    ...newItem,
  };

  return await todosAccess.createTodo(_newItem);
}

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  logger.info("Call function getAllTodos");

  return await todosAccess.getAllTodos(userId);
}

export async function UpdateTodo(
  userId: string,
  todoId: string,
  updatedTodo: UpdateTodoRequest
): Promise<TodoItem> {
  logger.info("Call function UpdateTodo");

  return await todosAccess.updateTodo(userId, todoId, updatedTodo);
}

export async function DeleteTodo(
  userId: string,
  todoId: string
): Promise<String> {
  logger.info("Call function DeleteTodo");

  return await todosAccess.deleteTodo(userId, todoId);
}

export async function createAttachmentPresignedUrl(
  userId: string,
  todoId: string
): Promise<String> {
  logger.info("Call function createAttachmentPresignedUrl");
  const uploadUrl = todosAccess.getUploadUrl(todoId, userId);

  return uploadUrl;
}
