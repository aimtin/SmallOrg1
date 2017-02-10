import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IOrganisations, IProducts } from '../interfaces';

declare var firebase: any;

@Injectable()
export class DataService {
    databaseRef: any = firebase.database();
    usersRef: any = firebase.database().ref('users');
    orgsRef: any = firebase.database().ref('organisations');
    productsRef: any = firebase.database().ref('products');
    statisticsRef: any = firebase.database().ref('statistics');
    storageRef: any = firebase.storage().ref();
    connectionRef: any = firebase.database().ref('.info/connected');

    defaultImageUrl: string;
    connected: boolean = false;

    constructor() {
        var self = this;
        try {
            self.checkFirebaseConnection();
            /*
            self.storageRef.child('images/default/profile.png').getDownloadURL().then(function (url) {
                self.defaultImageUrl = url.split('?')[0] + '?alt=media';
            });
            */
            self.InitData();
        } catch (error) {
            console.log('Data Service error:' + error);
        }
    }

    checkFirebaseConnection() {
        try {
            var self = this;
            var connectedRef = self.getConnectionRef();
            connectedRef.on('value', function (snap) {
                console.log(snap.val());
                if (snap.val() === true) {
                    console.log('Firebase: Connected:');
                    self.connected = true;
                } else {
                    console.log('Firebase: No connection:');
                    self.connected = false;
                }
            });
        } catch (error) {
            self.connected = false;
        }
    }

    isFirebaseConnected() {
        return this.connected;
    }

    private InitData() {
        let self = this;
        // Set statistics/orgs = 1 for the first time only
        self.getStatisticsRef().child('orgs').transaction(function (currentRank) {
            if (currentRank === null) {
                return 1;
            }
        }, function (error, committed, snapshot) {
            if (error) {
                console.log('Transaction failed abnormally!', error);
            } else if (!committed) {
                console.log('We aborted the transaction because there is already one org.');
            } else {
                console.log('Orgs number initialized!');

            }
            console.log('commited', snapshot.val());
        }, false);
    }

    getDatabaseRef() {
        return this.databaseRef;
    }

    getConnectionRef() {
        return this.connectionRef;
    }

    goOffline() {
        firebase.database().goOffline();
    }

    goOnline() {
        firebase.database().goOnline();
    }

    getDefaultImageUrl() {
        return this.defaultImageUrl;
    }

    getOrgsRef() {
        return this.orgsRef;
    }

    getProductsRef() {
        return this.productsRef;
    }

    getUsersRef() {
        return this.usersRef;
    }

    getStorageRef() {
        return this.storageRef;
    }

    /*getThreadProductsRef(threadKey: string) {
        return this.productsRef.orderByChild('thread').equalTo(threadKey);
    }*/

    loadOrgs() {
        return this.orgsRef.once('value');
    }

    submitOrg(org: IOrganisations, priority: number) {

        var newOrgRef = this.orgsRef.push();
        this.statisticsRef.child('orgs').set(priority);
        console.log(priority);
        return newOrgRef.setWithPriority(org, priority);
    }


    setUserImage(uid: string) {
        this.usersRef.child(uid).update({
            image: true
        });
    }

    setOrgImage(key: string) {
        this.orgsRef.child(key).update({
            image: true
        });
    }
    
    loadProducts(orgKey: string) {
        return this.productsRef.orderByChild('productName').equalTo(orgKey).once('value');
    }

    /*submitComment(threadKey: string, comment: IComment) {
        // let commentRef = this.productsRef.push();
        // let commentkey: string = commentRef.key;
        this.productsRef.child(comment.key).set(comment);

        return this.orgsRef.child(threadKey + '/comments').once('value')
            .then((snapshot) => {
                let numberOfComments = snapshot == null ? 0 : snapshot.val();
                this.orgsRef.child(threadKey + '/comments').set(numberOfComments + 1);
            });
    }*/

    getTotalOrgs() {
        return this.statisticsRef.child('orgs').once('value');
    }
    getStatisticsRef() {
        return this.statisticsRef;
    }

    getUsername(userUid: string) {
        return this.usersRef.child(userUid + '/username').once('value');
    }

    getUser(userUid: string) {
        return this.usersRef.child(userUid).once('value');
    }

    getUserOrgs(userUid: string) {
        return this.orgsRef.orderByChild('user/uid').equalTo(userUid).once('value');
    }

    getUserProducts(userUid: string) {
        return this.productsRef.orderByChild('user/uid').equalTo(userUid).once('value');
    }
}