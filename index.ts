import { Request, Response, Router, NextFunction } from "express";
import glob = require("glob");

export enum Method {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete"
}

type middelwareFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
  ...args: any[]
) => void;

type handlerFunction = (...args: any[]) => any;

export class RouteDefinition {
  path: string;
  method: Method;
  middelwares: middelwareFunction[];
  handler: handlerFunction;
  constructor(
    path: string,
    method: Method,
    middelwares: middelwareFunction[],
    handler: handlerFunction
  ) {
    this.path = path;
    this.method = method;
    this.middelwares = middelwares;
    this.handler = handler;
  }
}

export class Route {
  urlPrefix: string;
  routes: RouteDefinition[];
  constructor(urlPrefix: string, routes: RouteDefinition[]) {
    this.urlPrefix = urlPrefix;
    this.routes = routes;
  }
}

export const initializeRouter = (router: Router, dir: string): Router => {
  glob
    .sync("**/*.js", { cwd: `${dir}/` }) // traversing the dir and returning all the files/nested files
    .map((file: string) => require(`${dir}/${file}`)) // importing from the file
    .filter((routerDef: any) => routerDef instanceof Route) // filtering out the imports if the export is instance of Route
    .forEach((routerDef: Route) => {
      // register each of the routes on Express Router for each of the route definitions
      routerDef.routes.forEach(({ method, path, middelwares, handler }) => {
        const routePath = routerDef.urlPrefix
          ? `/${routerDef.urlPrefix}/${path}`
          : `/${path}`;
        router[method](routePath, middelwares, handler); // registering route on the express router
      });
    });
  return router;
};
