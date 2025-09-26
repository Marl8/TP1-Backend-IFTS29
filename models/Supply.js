class Supply {
    
    #id;
    #name;
    #category;
    #unitPrice;
    #stock;

    constructor(id, name, category, unitPrice, stock) {
        this.#id = id;
        this.#name = name;
        this.#category = category;
        this.#unitPrice = unitPrice;
        this.#stock = stock;
    }

    getId() {
        return this.#id;
    }

    getName() {
        return this.#name;
    }

    getCategory() {
        return this.#category;
    }

    getUnitPrice() {
        return this.#unitPrice;
    }

    getStock() {
        return this.#stock;
    }

    setName(name) {
        this.#name = name;
    }

    setCategory(category) {
        this.#category = category;
    }

    setUnitPrice(unitPrice) {
        this.#unitPrice = unitPrice;
    }

    setStock(stock) {
        this.#stock = stock;
    }
}

export default Supply;