"use strict";
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
exports.__esModule = true;
var products = require("./products.json");
var decimal_js_1 = require("decimal.js");
var Product_1 = require("./Product");
var Discount_1 = require("./Discount");
var Program = /** @class */ (function () {
    function Program() {
    }
    Program.prototype.main = function () {
        var products = this.loadProducts();
        products.forEach(function (product) {
            console.log("name: ".concat(product.name, " - price: ").concat(product.price));
        });
        console.log("Total: ".concat(this.checkoutProcess(products, Array.from(this.loadRules()))));
    };
    Program.prototype.checkoutProcess = function (products, rules) {
        var discounts = [];
        rules.forEach(function (rule) {
            discounts = discounts.concat(Array.from(rule.process(products)));
        });
        var amountWithoutDiscount = new decimal_js_1.Decimal(0);
        var totalDiscount = new decimal_js_1.Decimal(0);
        // original price
        products.forEach(function (product) {
            amountWithoutDiscount = amountWithoutDiscount.plus(product.price);
        });
        // discount amount
        discounts.forEach(function (discount) {
            totalDiscount = totalDiscount.plus(discount.amount);
            console.log("\u7B26\u5408\u6298\u6263 ".concat(discount.ruleName, ", \u6298\u62B5 ").concat(discount.amount, " \u5143"));
        });
        // original price - discount amount
        return amountWithoutDiscount.minus(totalDiscount);
    };
    Program.prototype.loadProducts = function () {
        var results = [];
        var id = Math.floor(Date.now() / 1000);
        products.forEach(function (product) {
            results.push(new Product_1.Product(id, product.sku, product.name, new decimal_js_1.Decimal(product.price)));
        });
        return results;
    };
    Program.prototype.loadRules = function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Discount_1.BuyMoreBoxesDiscount(2, 12)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    };
    return Program;
}());
var program = new Program();
program.main();
