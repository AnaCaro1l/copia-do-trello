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
exports.Card = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const List_1 = require("./List");
let Card = class Card extends sequelize_typescript_1.Model {
};
exports.Card = Card;
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Card.prototype, "title", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Card.prototype, "description", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Card.prototype, "media", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => List_1.List),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Card.prototype, "listId", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Card.prototype, "completed", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Card.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Card.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => List_1.List, 'listId'),
    __metadata("design:type", List_1.List)
], Card.prototype, "list", void 0);
exports.Card = Card = __decorate([
    sequelize_typescript_1.Table
], Card);
