import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { sleep } from '@utils/time';

import { Node, Link } from '@graph/models/graph';
import { miserables } from '@graph/mocks/data';

@Injectable()
export class DataService {
  nodeList = new BehaviorSubject<Node[]>([]);
  linkList = new BehaviorSubject<Link[]>([]);

  async fetchData() {
    await sleep(Math.random() * 1000);

    const { nodes, links } = miserables;

    this.nodeList.next(nodes);
    this.linkList.next(links);
  }
}
