    class Customer {
        
    #id;
    #name;
    #phone;
    #address;

    constructor(id, name, phone, address) {
        this.#id = id;
        this.#name = name;
        this.#phone = phone;
        this.#address = address;
    }

    getId() { 
        return this.#id; 
    }

    getName() { 
        return this.#name; 
    }

    setName(name) { 
        this.#name = name; 
    }

    getPhone() { 
        return this.#phone; 
    }

    setPhone(phone) { 
        this.#phone = phone; 
    }

    getAddress() { 
        return this.#address; 
    }

    setAddress(address) { 
        this.#address = address; 
    }
}

module.exports = Customer;