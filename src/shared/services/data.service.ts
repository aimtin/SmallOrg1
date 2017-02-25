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
    storageRef: any = firebase.storage().ref();
    connectionRef: any = firebase.database().ref('.info/connected');

    defaultImageUrl: string;
    connected: boolean = false;

    constructor() {
        var self = this;
        try {
            self.checkFirebaseConnection();
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
        /*let self = this;
        
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
        }, false);*/
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

    getStorageRef() {
        return this.storageRef;
    }

    
    /* User Related*/
    getUsersRef() {
        return this.usersRef;
    }
    setUserImage(uid: string) {
        this.usersRef.child(uid).update({
            image: true
        });
    }

    getUsername(userUid: string) {
        return this.usersRef.child(userUid + '/username').once('value');
    }

    getUser(userUid: string) {
        return this.usersRef.child(userUid).once('value');
    }

    /* Orgs Related */

    getOrgsRef() {
        return this.orgsRef;
    }

    getUserOrgs(userUid: string) {
        return this.orgsRef.orderByChild('user/uid').equalTo(userUid).once('value');
    }

    getOrg(key: string) {
        return this.orgsRef.child(key).once('value');
    }

    setOrgImage(key: string, flag: boolean) {
        this.orgsRef.child(key).update({
            image: flag
        });
    }
    setOrgStatus(key: string, status: string) {
        this.orgsRef.child(key).update({
            status: status
        });
    }

    submitOrg(org: IOrganisations) {

        var newOrgRef = this.orgsRef.push();
        return newOrgRef.set(org);
    }

    updateOrg(key: string, org: any) {
        this.orgsRef.child(key).update({
            orgName: org.name,
            address: org.address,
            email: org.email
        });
    }

    deleteOrg(key: string) {
        var self = this;
        
        return self.orgsRef.child(key).once('value').then(function(snapshot) {
            var image = snapshot.val().image;
            if (image) {
                var desertRef = self.storageRef.child('images/organisations/' + key + '/org.png');
                desertRef.delete().then(function() {
                    console.log('File deleted successfully');
            
                }).catch(function(error) {
                    console.log('An error occurred!'); 
            
                });
            }
            self.orgsRef.child(key).remove();
        });
    }

    /* Products Related */

    getProductsRef() {
        return this.productsRef;
    }

    getProduct(key: string) {
        return this.productsRef.child(key).once('value');
    }
    
    getUserProducts(userUid: string) {
        return this.productsRef.orderByChild('user/uid').equalTo(userUid).once('value');
    }

    getProductsByOrg(orgKey: string) {
        return this.productsRef.orderByChild('orgKey').equalTo(orgKey).once('value');
    }

    setProductImage(key: string, flag: boolean) {
        this.productsRef.child(key).update({
            image: flag
        });
    }
    setProductStatus(key: string, status: string) {
        this.productsRef.child(key).update({
            status: status
        });
    }

    submitProduct(product: IProducts) {

        var newProductRef = this.productsRef.push();
        return newProductRef.set(product);
    }

    updateProduct(key: string, orgKey: string, product: any) {
        
        this.productsRef.child(key).update({
            productName: product.name,
            brand: product.brand,
            orgKey: orgKey,
            description: product.description,
            qty: product.qty,
            rate: product.rate,
            amount: product.amount,
            subject: product.subject
        });
    }

    deleteProduct(key: string) {
        var self = this;
        
        return self.productsRef.child(key).once('value').then(function(snapshot) {
            var image = snapshot.val().image;
            if (image) {
                var desertRef = self.storageRef.child('images/products/' + key + '/product.png');
                desertRef.delete().then(function() {
                    console.log('File deleted successfully');
            
                }).catch(function(error) {
                    console.log('An error occurred!'); 
            
                });
            }
            self.productsRef.child(key).remove();
        });
    }

}