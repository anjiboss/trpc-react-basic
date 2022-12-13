"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@trpc/server");
const trpcExpress = __importStar(require("@trpc/server/adapters/express"));
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const cors_1 = __importDefault(require("cors"));
const PORT = 5000;
const t = server_1.initTRPC.create();
const userList = [
    {
        id: "1",
        name: "KATT",
    },
];
const appRouter = t.router({
    userById: t.procedure
        .input((val) => {
        if (typeof val === "string")
            return val;
        throw new Error(`Invalid input: ${typeof val}`);
    })
        .query((req) => {
        const input = req.input;
        const user = userList.find((it) => it.id === input);
        return user;
    }),
    hello: t.procedure.query(() => {
        return "hello world";
    }),
    userCreate: t.procedure
        .input(zod_1.z.object({ name: zod_1.z.string() }))
        .mutation((req) => {
        const id = String(userList.length + 1);
        const user = {
            id,
            name: req.input.name,
        };
        userList.push(user);
        return user;
    }),
    users: t.procedure.query(() => {
        return userList;
    }),
});
async function main() {
    const app = (0, express_1.default)();
    app.use((req, _res, next) => {
        var _a;
        console.log("⬅️ ", req.method, req.path, (_a = req.body) !== null && _a !== void 0 ? _a : req.query);
        next();
    });
    app.use((0, cors_1.default)({
        origin: "*",
    }));
    app.use("/trpc", trpcExpress.createExpressMiddleware({
        router: appRouter,
    }));
    app.get("/", (_req, res) => res.send("hello"));
    app.listen(PORT, () => {
        console.log("listening on port ", PORT);
    });
}
main();
//# sourceMappingURL=server.js.map