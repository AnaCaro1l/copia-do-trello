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
exports.Workspace = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
const WorkspaceUser_1 = require("./WorkspaceUser");
let Workspace = class Workspace extends sequelize_typescript_1.Model {
};
exports.Workspace = Workspace;
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Workspace.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Workspace.prototype, "background", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Workspace.prototype, "visibility", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Workspace.prototype, "ownerId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, 'ownerId'),
    __metadata("design:type", User_1.User)
], Workspace.prototype, "owner", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => User_1.User, () => WorkspaceUser_1.WorkspaceUser),
    __metadata("design:type", Array)
], Workspace.prototype, "collaborators", void 0);
exports.Workspace = Workspace = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'Workspaces',
        timestamps: true,
    })
], Workspace);
