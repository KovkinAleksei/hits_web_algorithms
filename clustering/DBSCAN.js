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
  // Массив для хранения кластеров
  let clusters = [];
  // Флаг для обозначения, была ли точка уже посещена
  let visited = new Set();
  // Итерация по всем точкам
  for (let p of points) {
    if (visited.has(p)) continue;

    visited.add(p);

    // Получаем всех соседей текущей точки
    let neighbors = findNeighbors(p, points, eps);

    if (neighbors.length < minPts) {
      // Точка не является ядром кластера, помечаем ее как выброс и переходим к следующей
      p.cluster = -1;
      continue;
    }

    // Создаем новый кластер
    let cluster = [p];
    clusters.push(cluster);

    // Массив точек для обработки
    let seeds = [...neighbors];

    // Итеративно расширяем кластер
    while (seeds.length > 0) {
      let q = seeds.shift();

      if (!visited.has(q)) {
        visited.add(q);

        // Получаем соседей точки
        let qNeighbors = findNeighbors(q, points, eps);

        if (qNeighbors.length >= minPts) {
          seeds = [...seeds, ...qNeighbors];
        }
      }

      // Если точка не принадлежит кластеру, добавляем ее в него
      if (q.cluster === undefined || q.cluster === -1) {
        cluster.push(q);
      }

      // Помечаем точку как посещенную и принадлежащую кластеру
      q.cluster = clusters.length;
    }
  }
  delete points.cluster;
  return clusters;
}