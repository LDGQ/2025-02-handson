import {Product} from "@/app/interface/product";

interface CartItem {
    productId: string;
    productName: string;
    priceId: string;
    amount: number;
    count: number;  //  数量
}

export class Cart {
    currency: string;
    items: CartItem[];

    constructor(currency: string = 'jpy') {
        this.currency = currency;
        this.items = [];
    }

    // 指定された商品がカートに存在するかチェックし、数量を取得する
    getCount(product: Product): number {
        return (
            this.items.find(
                (item) => item.productId === product.id && item.priceId === product.prices[0].id
            )?.count || 0
        );
    }

    // 商品情報を取得
    getDetail(): Record<string, any> {
        return this.items.map((item): Record<string, any> => ({
            name: item.productName,
            currency: this.currency,
            amount: item.amount
        }));
    }


    // カートに商品を追加
    add(product: Product, count: number) {
        const existingItemIndex = this.items.findIndex(
            (item) => item.productId === product.id && item.priceId === product.prices[0].id
        );

        if (existingItemIndex !== -1) {
            // 既存商品の数量を更新
            this.items[existingItemIndex].count = count;
        } else {
            // 新規商品を追加
            this.items.push({
                productId: product.id,
                productName: product.name,
                priceId: product.prices[0].id,
                amount: product.prices[0].unit_amount,
                count: count
            });
        }
    }

    totalAmount(): number {
        return this.items.reduce((sum: number, item: CartItem) => sum + item.amount * item.count, 0);
    }

    getMetadata(): Record<string, string> {
        return this.items
            .filter((item: CartItem) => item.count > 0)
            .reduce((acc: Record<string, string>, item: CartItem) => {
            acc[item.productId] = JSON.stringify({ price: item.amount, count: item.count});
            return acc;
        }, {} as Record<string, string>)
    }
}