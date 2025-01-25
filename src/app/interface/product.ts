export interface Product {
    id: string;
    name: string;
    images: string[];
    prices: Price[];
}

export interface Price {
    id: string;
    currency: string;
    unit_amount: number;
    type: string;
}