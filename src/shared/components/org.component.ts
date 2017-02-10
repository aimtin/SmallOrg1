import { Component, EventEmitter, OnInit, OnDestroy, Input, Output } from '@angular/core';

import { IOrganisations } from '../interfaces';
import { DataService } from '../services/data.service';

@Component({
    selector: 'forum-org',
    templateUrl: 'org.component.html'
})
export class OrgComponent implements OnInit, OnDestroy {
    @Input() org: IOrganisations;
    // @Output() onViewComments = new EventEmitter<string>();

    constructor(private dataService: DataService) { }

    ngOnInit() {
        var self = this;
        //self.dataService.getOrgsRef().child(self.org.key).on('child_changed', self.onCommentAdded);
    }

    ngOnDestroy() {
         console.log('destroying..');
        var self = this;
        //self.dataService.getOrgsRef().child(self.org.key).off('child_changed', self.onCommentAdded);
    }

}