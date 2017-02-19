import { Component, Input, OnInit } from '@angular/core';
import { PhotoViewer } from 'ionic-native';

import { IOrganisations } from '../interfaces';
import { DataService } from '../services/data.service';

@Component({
    selector: 'forum-org-avatar',
    template: ` <img *ngIf="imageLoaded" src="{{imageUrl}}" (click)="zoom()" >`
})
export class OrgAvatarComponent implements OnInit {
    @Input() org: IOrganisations;
    imageLoaded: boolean = false;
    imageUrl: string;

    constructor(private dataService: DataService) { }

    ngOnInit() {
        console.log('Org Avatar : ngOnInit ');
        let self = this;
        let firebaseConnected: boolean = self.dataService.isFirebaseConnected(); 
        if (self.org.key === 'default' || !firebaseConnected) {
            console.log('Org Avatar : !firebaseConnected ');
            self.imageUrl = 'assets/images/org.png';
            self.imageLoaded = true;
        } else {
            console.log('Org Avatar : firebaseConnected ');
            self.dataService.getOrgsRef().child(self.org.key).once('value').then(function(snapshot) {
                var image = snapshot.val().image;
                if (image) {
                    self.dataService.getStorageRef().child('images/organisations/' + self.org.key + '/org.png').getDownloadURL().then(function (url) {
                        console.log('Org Avatar : firebaseConnected ' + url);
                        self.imageUrl = url.split('?')[0] + '?alt=media' + '&t=' + (new Date().getTime());
                        self.imageLoaded = true;
                    });
                }else {
                    self.dataService.getStorageRef().child('images/organisations/default/org.png').getDownloadURL().then(function (url) {
                        console.log('Org Avatar : firebaseConnected ' + url);
                        self.imageUrl = url.split('?')[0] + '?alt=media' + '&t=' + (new Date().getTime());
                        self.imageLoaded = true;
                    });
                }
  
            });
            
        }
        
    }

    zoom() {
        PhotoViewer.show(this.imageUrl, this.org.orgName, { share: false });
    }

    getOrgImage() {
        var self = this;
        console.log('Org Avatar : getOrgImage ');
        return self.dataService.getStorageRef().child('images/organisations/' + self.org.key + '/org.png').getDownloadURL();
    }
}