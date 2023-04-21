export function returnToOriginalStage(){
    document.getElementById("addVertexButton").textContent = "Добавить вершину ВЫКЛ";
    document.getElementById("deleteVertexButton").textContent = "Удалить вершину ВЫКЛ";
}

export function changeAddButton(){
    document.getElementById("deleteVertexButton").textContent = "Удалить вершину ВЫКЛ";
    document.getElementById("addVertexButton").textContent = "Добавить вершину ВКЛ";
}

export function changeDeleteButton(){
    document.getElementById("addVertexButton").textContent = "Добавить вершину ВЫКЛ";
    document.getElementById("deleteVertexButton").textContent = "Удалить вершину ВКЛ";
}

export function offAllButtons() {
    document.getElementById("findPathButton").disabled = true;
    document.getElementById("addVertexButton").disabled = true;
    document.getElementById("deleteVertexButton").disabled = true;
    document.getElementById("clearButton").disabled = true;
    document.getElementById("getLines").disabled = true;
    document.getElementById("inputRange").disabled = true;
    document.getElementById("iterationRange").disabled = true;
    document.getElementById("rhoRange").disabled = true;
    document.getElementById("warning").style.display = "block";
}

export function onAllButtons(flag) {
    document.getElementById("findPathButton").disabled = false;
    document.getElementById("addVertexButton").disabled = false;
    document.getElementById("deleteVertexButton").disabled = false;
    document.getElementById("clearButton").disabled = false;
    document.getElementById("getLines").disabled = false;
    document.getElementById("inputRange").disabled = false;
    document.getElementById("iterationRange").disabled = false;
    document.getElementById("rhoRange").disabled = false;
    document.getElementById("warning").style.display = "none";
    if(!flag) {
        document.getElementById("done").style.display = "block";
        setTimeout(() => {
            document.getElementById("done").style.display = "none";
        }, 1500);
    }
}
