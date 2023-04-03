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