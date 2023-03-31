const ANTS = 200; //количество муравьев
const ITERATIONS = 1000; //итерации
const ALPHA = 1; //коэффициент влияния феромона
const BETA = 2.5; //коэффициент влияния эвристической информации
const RHO = 0.2; //коэффициент испарения феромона
const Q = 50;
const 

class Ant { 
    constructor (countCities) { 
        this.visited = new Array(numCities).fill(false);
        this.tour = new Array(numCities);
        this.length = 0;
    }
}
