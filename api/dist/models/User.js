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
exports.User = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Workspace_1 = require("./Workspace");
const WorkspaceUser_1 = require("./WorkspaceUser");
const Invite_1 = require("./Invite");
let User = class User extends sequelize_typescript_1.Model {
};
exports.User = User;
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.VIRTUAL),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Workspace_1.Workspace),
    __metadata("design:type", Array)
], User.prototype, "workspaces", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Workspace_1.Workspace, () => WorkspaceUser_1.WorkspaceUser),
    __metadata("design:type", Array)
], User.prototype, "collaborations", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => WorkspaceUser_1.WorkspaceUser),
    __metadata("design:type", Array)
], User.prototype, "workspaceUsers", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Invite_1.Invite, 'senderId'),
    __metadata("design:type", Array)
], User.prototype, "sentInvites", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Invite_1.Invite, 'receiverId'),
    __metadata("design:type", Array)
], User.prototype, "receivedInvites", void 0);
exports.User = User = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'Users',
        timestamps: true,
    })
], User);
