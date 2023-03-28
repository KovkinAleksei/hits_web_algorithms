export { dbscan };

function findDistance(point1, point2) {
    let x = point1.x - point2.x;
    let y = point1.y - point2.y;
    return Math.sqrt(x * x + y * y);
}


function findNeighbors(point, pointCoordinates, eps) { 
    let neighbors = [];

    for (let i = 0; i < pointCoordinates.length; i++) { 
        if (point === pointCoordinates[i]) {
            continue;
        }
        let distance = findDistance(point, pointCoordinates[i]);
        if (distance < eps) {
            neighbors.push(pointCoordinates[i]);
        }
    }
    return neighbors;
}


function dbscan(points, eps, minPts) {
  let clusters = [];
  let visited = new Set();
  let noise = new Set();

  // Итерация по всем точкам
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (visited.has(p)) continue;

    visited.add(p);

    // Получаем всех соседей текущей точки
    const neighbors = findNeighbors(p, points, eps);

    if (neighbors.length < minPts) {
      // Точка не является ядром кластера или соседей недостаточно, помечаем ее как выброс и переходим к следующей
      noise.add(p);
      continue;
    }

    // Создаем новый кластер и добавляем в него текущую точку
    const cluster = [p];
    clusters.push(cluster);

    // Итеративно расширяем кластер
    let seedSet = new Set(neighbors);
    while (seedSet.size > 0) {
      const q = seedSet.values().next().value;
      visited.add(q);

      const qNeighbors = findNeighbors(q, points, eps);

      if (qNeighbors.length >= minPts) {
        qNeighbors.forEach(n => {
          if (!visited.has(n)) {
            seedSet.add(n);
            visited.add(n);
          }
        });
      }

      if (!noise.has(q)) {
        cluster.push(q);
      }

      seedSet.delete(q);
    }
  }

  return clusters;
}
