// import express from 'express';
const express = require('express');
let rootsData = [
    { "id": 1, "name": "Root Node", "parent_id": null },
    { "id": 2, "name": "Child 1 of Root", "parent_id": 1 },
    { "id": 3, "name": "Child 2 of Root", "parent_id": 1 },
    { "id": 4, "name": "Child 3 of Root", "parent_id": 1 },
    { "id": 5, "name": "Child 1 of Child 1", "parent_id": 2 },
    { "id": 6, "name": "Child 2 of Child 1", "parent_id": 2 },
    { "id": 7, "name": "Child 1 of Child 2", "parent_id": 3 },
    { "id": 8, "name": "Child 1 of Child 3", "parent_id": 4 },
    { "id": 9, "name": "Grandchild 1 of Child 1 of Child 3", "parent_id": 8 },
    { "id": 10, "name": "Grandchild 2 of Child 1 of Child 3", "parent_id": 8 }
]

let app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/:id/:parent_id', (req, res) => {
    // res.send('Hello World!');
    let id1 = parseInt(req.params.id);
    let id2 = parseInt(req.params.parent_id);

    let tree = buildTree(rootsData);
    //checking the id irrespective of id and parent_id
    if (id1 > id2) {
        [id1, id2] = [id2, id1];
    }
    let path = findPath(tree, id1, id2);
    let edges = path.length != 0 ? path.length - 1 : 0;

    res.json({
        nodes: path,
        edges: edges
    });
});

function buildTree(nodes, parentId = null) {
    const tree = {};
    nodes.forEach(node => {
        if (node.parent_id === parentId) {
            tree[node.id] = { id: node.id };
            const children = buildTree(nodes, node.id);
            if (Object.keys(children).length > 0) {
                tree[node.id].children = children;
            }
        }
    });
    return tree;
}

//function to find a Node by its id. 
function findNodeById(tree, id) {
    for (const key in tree) {
        const node = tree[key];
        if (node.id === id) return node;
        if (node.children) {
            const result = findNodeById(node.children, id);
            if (result) return result;
        }
    }
    return null;
}

// function to all the possible paths between two given Id's
function findPath(tree, startId, endId) {
    const path = [];

    function findPathRecursive(node, targetId) {
        if (node.id === targetId) {
            path.push(node.id);
            return true;
        }
        if (node.children) {
            for (const childId in node.children) {
                if (findPathRecursive(node.children[childId], targetId)) {
                    path.push(node.id);
                    return true;
                }
            }
        }
        return false;
    }

    const node = findNodeById(tree, startId);
    if (node) {
        findPathRecursive(node, endId);
        path.reverse();
    }

    return path;
}


app.listen(3000, () => {
    console.log('Server started');
});