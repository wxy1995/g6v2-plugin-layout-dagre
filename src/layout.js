/**
 * dagre
 * dagre layout wiki: https://github.com/cpettitt/dagre/wiki
 */

const G6 = require('@antv/g6');
const dagre = require('dagre');
const { Util } = G6;

class Layout {
  constructor(options) {
    Util.mix(this, {
      rankdir: 'TB',
      align: undefined,
      nodesep: 50,
      edgesep: 10,
      ranksep: 50,
      marginx: 0,
      marginy: 0,
      acyclicer: undefined,
      useEdgeControlPoint: true,
      ranker: 'network-simplex',
      callback: null,
      compound: false,
      multigraph: false,
    }, options);
  }
  getValue(name) {
    const value = this[name];
    if (Util.isFunction(value)) {
      return value();
    }
    return value;
  }
  // 执行布局
  execute() {
    const nodes = this.nodes.concat(this.groups);
    const edges = this.edges;
    const nodeMap = {};
    const compound = this.getValue('compound');
    const multigraph = this.getValue('multigraph');
    const callback = this.getValue('callback');
    const g = new dagre.graphlib.Graph({
      compound,
      multigraph,
    });
    const useEdgeControlPoint = this.useEdgeControlPoint;
    g.setGraph({
      rankdir: this.getValue('rankdir'),
      align: this.getValue('align'),
      nodesep: this.getValue('nodesep'),
      edgesep: this.getValue('edgesep'),
      ranksep: this.getValue('ranksep'),
      marginx: this.getValue('marginx'),
      marginy: this.getValue('marginy'),
      acyclicer: this.getValue('acyclicer'),
      ranker: this.getValue('ranker')
    });
    g.setDefaultEdgeLabel(function() { return {}; });
    nodes.forEach(node => {
      g.setNode(node.id, { width: node.width, height: node.height });
      if (compound && node.parent) {
        g.setParent(node.id, node.parent);
      }
      nodeMap[node.id] = node;
    });
    edges.forEach(edge => {
      g.setEdge(edge.source, edge.target);
    });
    dagre.layout(g);
    g.nodes().forEach(v => {
      const node = g.node(v);
      nodeMap[v].x = node.x;
      nodeMap[v].y = node.y;
      // nodeMap[v].width = node.width;
      // nodeMap[v].height = node.height;
    });
    g.edges().forEach((e, i) => {
      const edge = g.edge(e);
      if (useEdgeControlPoint) {
        edges[i].controlPoints = edge.points.slice(1, edge.points.length - 1);
      }
    });
    this.graph.updateNodePosition();
    this.graph.emit('afterlayout');
    callback && callback();
  }
}

module.exports = Layout;

