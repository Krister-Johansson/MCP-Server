"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mcp_nest_1 = require("@rekog/mcp-nest");
const configuration_1 = require("./config/configuration");
const prisma_module_1 = require("./prisma/prisma.module");
const greeting_1 = require("./tool/greeting");
const todos_module_1 = require("./todos/todos.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            mcp_nest_1.McpModule.forRoot({
                name: 'my-mcp-server',
                version: '1.0.0',
                sse: {
                    pingEnabled: true,
                    pingIntervalMs: 30000,
                },
            }),
            prisma_module_1.PrismaModule,
            todos_module_1.TodosModule,
        ],
        controllers: [],
        providers: [greeting_1.GreetingTool],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map