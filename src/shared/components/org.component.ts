import { Component, EventEmitter, OnInit, OnDestroy, Input, Output} from '@angular/core';
import { Events} from 'ionic-angular';

import { IOrganisations } from '../interfaces';
import { DataService } from '../services/data.service';

@Component({
    selector: 'forum-org',
    templateUrl: 'org.component.html'
})
export class OrgComponent implements OnInit, OnDestroy {
    @Input() org: IOrganisations;
    @Output() onModifyOrgs = new EventEmitter<string>();
    //@Output() onDeleteOrgs = new EventEmitter<string>();

    constructor(private dataService: DataService,
                public events: Events) { }

    ngOnInit() {
        //var self = this;
        //self.dataService.getOrgsRef().child(self.org.key).on('child_changed', self.onCommentAdded);
    }

    ngOnDestroy() {
         console.log('destroying..');
        //var self = this;
        //self.dataService.getOrgsRef().child(self.org.key).off('child_changed', self.onCommentAdded);
    }

    modifyOrg(key: string) {
        console.log('modifyOrg : ' + key);
 
        this.onModifyOrgs.emit(key);
        
    }

    deleteOrg(key: string) {
      var self = this;

        console.log('deleteOrg : ' + key);
        self.events.publish('org:deleted', key);  
        /*self.dataService.deleteOrg(key).then(function (snapshot) {
            
        });*/

    }

    logoOrg(key: string){
        this.events.publish('image:created', key);
    }

}