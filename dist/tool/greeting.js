"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreetingTool = void 0;
const common_1 = require("@nestjs/common");
const mcp_nest_1 = require("@rekog/mcp-nest");
const zod_1 = require("zod");
let GreetingTool = class GreetingTool {
    constructor() { }
    async sayHello({ name }, context) {
        const greeting = `Hello, ${name}!`;
        const totalSteps = 5;
        for (let i = 0; i < totalSteps; i++) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            await context.reportProgress({
                progress: (i + 1) * 20,
                total: 100,
            });
        }
        return {
            content: [{ type: 'text', text: greeting }],
        };
    }
    async getCurrentSchema({ uri, userName }) {
        return {
            content: [
                {
                    uri,
                    text: `User is ${userName}`,
                    mimeType: 'text/plain',
                },
            ],
        };
    }
};
exports.GreetingTool = GreetingTool;
__decorate([
    (0, mcp_nest_1.Tool)({
        name: 'hello-world',
        description: 'Returns a greeting and simulates a long operation with progress updates',
        parameters: zod_1.z.object({
            name: zod_1.z.string().default('World'),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GreetingTool.prototype, "sayHello", null);
__decorate([
    (0, mcp_nest_1.Resource)({
        uri: 'mcp://hello-world/{userName}',
        name: 'Hello World',
        description: 'A simple greeting resource',
        mimeType: 'text/plain',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GreetingTool.prototype, "getCurrentSchema", null);
exports.GreetingTool = GreetingTool = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GreetingTool);
//# sourceMappingURL=greeting.js.map