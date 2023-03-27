export {dbscan};

function dbscan(points, eps, minPts) {
  let clusters = [];
  let visited = new Set();
  let noise = new Set();

  function regionQuery(pointIndex) {
    let neighbors = [];
    for (let i = 0; i < points.length; i++) {
      if (i === pointIndex) continue;
      let dist = Math.sqrt((points[i].x - points[pointIndex].x) ** 2 + (points[i].y - points[pointIndex].y) ** 2);
      if (dist < eps) {
        neighbors.push(i);
      }
    }
    return neighbors;
  }

  function expandCluster(clusterIndex, pointIndex, neighbors) {
    clusters[clusterIndex].push(pointIndex);
    visited.add(pointIndex);

    for (let neighborIndex of neighbors) {
      if (!visited.has(neighborIndex)) {
        visited.add(neighborIndex);
        let neighborNeighbors = regionQuery(neighborIndex);
        if (neighborNeighbors.length >= minPts) {
          neighbors = neighbors.concat(neighborNeighbors);
        }
      }
      if (!clusters.some(cluster => cluster.includes(neighborIndex))) {
        clusters[clusterIndex].push(neighborIndex);
      }
    }
  }

  for (let i = 0; i < points.length; i++) {
    if (visited.has(i)) continue;

    visited.add(i);

    let neighbors = regionQuery(i);
    if (neighbors.length < minPts) {
      noise.add(i);
    } else {
      clusters.push([]);
      expandCluster(clusters.length - 1, i, neighbors);
    }
  }

  return {clusters, noise};
}