class MenuItem{

    #id;
    #name;
    #price;
    #category;
    #stock;
    #listSupplies;

    constructor(id, name, price, category, stock){
        this.#id = id;
        this.#name = name;
        this.#price = price;
        this.#category = category;
        this.#stock = stock;
        this.#listSupplies = []; 
    }

    getId(){
        return this.#id;
    }

    getName(){
        return this.#name;
    }

    setName(name){
        return this.#name = name;        
    }

    getPrice(){
        return this.#price;
    }

    setPrice(price){
        return this.#price = price;        
    }

    getCategory(){
        return this.#category;
    }

    setCategory(category){
        return this.#category = category;        
    }

    getStock(){
        return this.#stock;
    }

    setStock(stock){
        return this.#stock = stock;        
    }

    setSupplies(listSupplies) {
        this.#listSupplies = listSupplies;
    }

    removeSupply(index) { 
        this.#listSupplies.splice(index, 1); 
    }
    
    getSupplies() { 
        return [...this.#listSupplies]; 
    }
}

export default MenuItem;