import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { CreateTodoRequest } from "../../requests/CreateTodoRequest";
import { getUserId } from "../utils";
import { CreateTodo } from "../../businessLogic/todos";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body);
    const userId = getUserId(event);
    try {
      const newItem = await CreateTodo(newTodo, userId);
      return {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        statusCode: 201,
        body: JSON.stringify({
          item: newItem,
        }),
      };
    } catch (error) {
      return {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        statusCode: 500,
        body: JSON.stringify({ Error: error }),
      };
    }
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
