"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.TotalPriceDiscount = exports.BuyMoreBoxesDiscount = exports.Discount = exports.RuleBase = void 0;
var decimal_js_1 = require("decimal.js");
var RuleBase = /** @class */ (function () {
    function RuleBase() {
    }
    return RuleBase;
}());
exports.RuleBase = RuleBase;
var Discount = /** @class */ (function () {
    function Discount(amount, products, rule) {
        this.amount = amount;
        this.products = products;
        this.rule = rule;
    }
    return Discount;
}());
exports.Discount = Discount;
// 兩箱折扣
var BuyMoreBoxesDiscount = /** @class */ (function (_super) {
    __extends(BuyMoreBoxesDiscount, _super);
    function BuyMoreBoxesDiscount(boxes, percentOff) {
        var _this = _super.call(this) || this;
        _this.boxCount = 0;
        _this.percentOff = 0;
        _this.boxCount = boxes;
        _this.percentOff = percentOff;
        _this.name = "".concat(_this.boxCount, " \u7BB1\u7D50\u5E33 ").concat(100 - _this.percentOff, " \u6298");
        _this.note = "\u71B1\u92B7\u98F2\u54C1 \u9650\u6642\u512A\u60E0";
        return _this;
    }
    // 折扣規則的實作
    BuyMoreBoxesDiscount.prototype.process = function (cart) {
        var matchedProducts, _loop_1, this_1, _i, _a, product;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    matchedProducts = [];
                    _loop_1 = function (product) {
                        var amount_1;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    matchedProducts.push(product);
                                    if (!(matchedProducts.length == this_1.boxCount)) return [3 /*break*/, 2];
                                    amount_1 = new decimal_js_1["default"](0);
                                    matchedProducts.forEach(function (product) {
                                        amount_1 = amount_1.plus(product.price);
                                    });
                                    return [4 /*yield*/, new Discount(amount_1.mul(this_1.percentOff).div(100), __spreadArray([], matchedProducts, true), this_1)];
                                case 1:
                                    _c.sent();
                                    matchedProducts.splice(0);
                                    _c.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    };
                    this_1 = this;
                    _i = 0, _a = cart.purchasedItems;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    product = _a[_i];
                    return [5 /*yield**/, _loop_1(product)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    };
    return BuyMoreBoxesDiscount;
}(RuleBase));
exports.BuyMoreBoxesDiscount = BuyMoreBoxesDiscount;
// 滿 ** 送 **
var TotalPriceDiscount = /** @class */ (function (_super) {
    __extends(TotalPriceDiscount, _super);
    function TotalPriceDiscount(minPrice, discount) {
        var _this = _super.call(this) || this;
        _this.minDiscountPrice = minPrice;
        _this.discountAmount = discount;
        _this.name = "\u6298\u50F9\u6EFF ".concat(_this.minDiscountPrice, " \u9001 ").concat(_this.discountAmount);
        _this.note = "\u6BCF\u6B21\u4EA4\u6613\u9650\u7528\u4E00\u6B21";
        return _this;
    }
    TotalPriceDiscount.prototype.process = function (cart) {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!cart.totalPrice.gte(this.minDiscountPrice)) return [3 /*break*/, 2];
                    return [4 /*yield*/, new Discount(this.discountAmount, cart.purchasedItems, this)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    };
    return TotalPriceDiscount;
}(RuleBase));
exports.TotalPriceDiscount = TotalPriceDiscount;
