export { kMeans };
import { Point } from "./pointClass.js";
import { pointCoordinates } from "./main.js";

const MAXVALUE = 100000000;

function findDistance(point1, point2) {
    let x = point1.x - point2.x;
    let y = point1.y - point2.y;
    return Math.sqrt(x * x + y * y);
}

function generateStartCentroids(countClusters) {
    let centroids = [];
    for (let i = 0; i < countClusters; i++) {
        let point = pointCoordinates[Math.floor(Math.random() * pointCoordinates.length)];
        centroids.push(new Point(point.x, point.y));
    }
    return centroids;
}

function updateCentroids(centroids, clusters) { 
    let newCentroids = [];
    for (let i = 0; i < clusters.length; i++) {
        let cluster = clusters[i];
        if (cluster.length === 0) {
            newCentroids.push(centroids[i]);
        } else {
            let sumX = 0;
            let sumY = 0;
            for (let j = 0; j < cluster.length; j++) {
                sumX += cluster[j].x;
                sumY += cluster[j].y;
            }
            newCentroids.push(new Point(sumX / cluster.length, sumY / cluster.length));
        }
    }
    return newCentroids;
}


function getPointsToNearestCentroids (centroids, clusters) { 
    for (let i = 0; i < pointCoordinates.length; i++) {

        let point = pointCoordinates[i];
        let minDistance = MAXVALUE;
        let closestCentroid;

        for (let j = 0; j < centroids.length; j++) {
            let distance = findDistance(point, centroids[j]);

            if (distance < minDistance) {
                minDistance = distance;
                closestCentroid = centroids[j];
            }
        }

        clusters[centroids.indexOf(closestCentroid)].push(point);
    }
}


function kMeans(countClusters) {
    let clusters = new Array(countClusters).fill().map(() => []);
    let centroids = generateStartCentroids(countClusters);
    let converged = false;

    while (!converged) {
        //Очистка массивов кластеров
        for (let i = 0; i < clusters.length; i++) {
            clusters[i] = [];
        }
        //Назначение точек к ближайшим центроидам
        getPointsToNearestCentroids(centroids, clusters);
        //Обновление координат центроидов
        let newCentroids = updateCentroids(centroids, clusters);
        //Проверка сходимости
        converged = true;
        for (let i = 0; i < centroids.length; i++) {
            if (findDistance(centroids[i], newCentroids[i]) > 0.001) {
                converged = false;
                break;
            }
        }
        //Обновление координат центроидов
        centroids = newCentroids;
    }
    return clusters;
}
