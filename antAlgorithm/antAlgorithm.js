const numAnts = 200;
const maxIterations = 1000;
const alpha = 1;
const beta = 2.5;
const rho = 0.2;
const q = 50;

export function antColonyOptimization(points) {
    // points - массив структур точек с координатами x и y
    // numAnts - количество муравьев
    // maxIterations - максимальное количество итераций
    // alpha - коэффициент влияния феромона
    // beta - коэффициент влияния эвристической информации
    // rho - коэффициент испарения феромона
    // q - количество феромона, оставляемое муравьем на своем пути
    
    // Расчет матрицы расстояний между точками
    const distances = new Array(points.length);
    for (let i = 0; i < points.length; i++) {
      distances[i] = new Array(points.length);
      for (let j = 0; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        distances[i][j] = Math.sqrt(dx*dx + dy*dy);
      }
    }
    
    // Инициализация матрицы феромонов
    const pheromones = new Array(points.length);
    for (let i = 0; i < points.length; i++) {
      pheromones[i] = new Array(points.length).fill(10);
    }
    
    // Инициализация массива лучших путей
    let bestTour;
    let bestTourLength = Infinity;
    
    // Основной цикл алгоритма
    for (let iteration = 0; iteration < maxIterations; iteration++) {
      // Создание новых муравьев
      const ants = new Array(numAnts);
      for (let i = 0; i < numAnts; i++) {
        ants[i] = new Ant(points.length);
      }
      
      // Проход каждым муравьем
      for (let i = 0; i < numAnts; i++) {
        const ant = ants[i];
        const start = Math.floor(Math.random() * points.length);
        ant.visited[start] = true;
        ant.tour[0] = start;
        
        // Построение пути муравья
        for (let j = 1; j < points.length; j++) {
          const prev = ant.tour[j-1];
          let next;
          if (Math.random() < 0.05) {
            // Случайный выбор следующей точки среди непосещенных
            for (let k = 0; k < points.length; k++) {
              if (!ant.visited[k]) {
                next = k;
                break;
              }
            }
          } else {
             // Выбор следующей точки на основе вероятности
          const probs = new Array(points.length).fill(0);
          let total = 0;
          for (let k = 0; k < points.length; k++) {
            if (!ant.visited[k]) {
              probs[k] = Math.pow(pheromones[prev][k], alpha) * Math.pow(1/distances[prev][k], beta);
              total += probs[k];
            }
          }
          const r = Math.random() * total;
          let sum = 0;
          for (let k = 0; k < points.length; k++) {
            if (!ant.visited[k]) {
              sum += probs[k];
              if (sum >= r) {
                next = k;
                break;
              }
            }
          }
        }
        ant.visited[next] = true;
        ant.tour[j] = next;
        ant.length += distances[prev][next];
      }
      
      // Обновление лучшего пути
      if (ant.length < bestTourLength) {
        bestTourLength = ant.length;
        bestTour = ant.tour.slice();
      }
      
      // Обновление матрицы феромонов
      for (let j = 1; j < points.length; j++) {
        const prev = ant.tour[j-1];
        const next = ant.tour[j];
        pheromones[prev][next] = (1-rho) * pheromones[prev][next] + rho * q / ant.length;
        pheromones[next][prev] = pheromones[prev][next];
      }
    }
  }
  
  // Возврат лучшего пути
  return bestTour;
}

// Класс муравья
class Ant {
  constructor(numCities) {
    this.visited = new Array(numCities).fill(false);
    this.tour = new Array(numCities);
    this.length = 0;
  }
}