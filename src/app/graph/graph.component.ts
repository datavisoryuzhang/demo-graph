import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';

import { ForceGraph } from '@graph/utils/graph';
import { DataService } from '@graph/services/data.service';
import { Node, Link } from '@graph/models/graph';

@Component({
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();

  constructor(
    private dataService: DataService,
  ) {
    this.subscription.add(combineLatest([
      this.dataService.nodeList,
      this.dataService.linkList,
    ]).subscribe(([nodes, links]) => {
      console.log('next stream: ', nodes, links);
      if (nodes.length > 0 && links.length > 0) {
        this.renderGraph(nodes, links);
      }
    }));
  }

  ngOnInit() {
    this.dataService.fetchData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  renderGraph(nodes: Node[], links: Link[]) {
    const graph = document.getElementById('demo_graph');

    if (graph) {
      const width = graph.clientWidth;
      const height = graph.clientHeight;

      graph.appendChild(ForceGraph({ nodes, links }, {
        width, height,
        nodeId: d => d.id,
        nodeGroup: d => (d.group || ''),
        nodeTitle: d => `${d.id}\n${d.group}`,
        linkStrokeWidth: l => Math.sqrt(l.value || 0),
        invalidation: undefined, // a promise to stop the simulation when the cell is re-run
      }));
    }
  }
}
