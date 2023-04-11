export function returnToOriginalStage(){
    document.getElementById("addVertexButton").style.backgroundColor = "";
    document.getElementById("deleteVertexButton").style.backgroundColor = "";
}

export function changeAddButton(){
    document.getElementById("deleteVertexButton").style.backgroundColor = "";
    document.getElementById("addVertexButton").style.backgroundColor = "#acaaa6";
}

export function changeDeleteButton(){
    document.getElementById("addVertexButton").style.backgroundColor = "";
    document.getElementById("deleteVertexButton").style.backgroundColor = "#acaaa6";
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

export function onAllButtons() {
    document.getElementById("findPathButton").disabled = false;
    document.getElementById("addVertexButton").disabled = false;
    document.getElementById("deleteVertexButton").disabled = false;
    document.getElementById("clearButton").disabled = false;
    document.getElementById("getLines").disabled = false;
    document.getElementById("inputRange").disabled = false;
    document.getElementById("iterationRange").disabled = false;
    document.getElementById("rhoRange").disabled = false;
    document.getElementById("warning").style.display = "none";
    document.getElementById("done").style.display = "block";
    setTimeout(() => {
        document.getElementById("done").style.display = "none";
    }, 3000);
}