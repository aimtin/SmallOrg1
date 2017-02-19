import { Injectable } from '@angular/core';

import { IOrganisations, IProducts } from '../interfaces';
import { ItemsService } from '../services/items.service';

@Injectable()
export class MappingsService {

    constructor(private itemsService: ItemsService) { }

    getOrgs(snapshot: any): Array<IOrganisations> {
        let orgs: Array<IOrganisations> = [];
        if (snapshot.val() == null)
            return orgs;

        let list = snapshot.val();

        Object.keys(snapshot.val()).map((key: any) => {
            let org: any = list[key];
            orgs.push({
                key: key,
                orgName: org.orgName,
                address: org.address,
                email: org.email,
                status: org.status,
                user: { uid: org.user.uid, username: org.user.username }
            });
        });

        return orgs;
    }

    getOrg(snapshot: any, key: string): IOrganisations {

        let org: IOrganisations = {
            key: key,
            orgName: snapshot.orgName,
            address: snapshot.address,
            email: snapshot.email,
            status: snapshot.status,
            user: snapshot.user
        };

        return org;
    }

    getProducts(snapshot: any): Array<IProducts> {
        let products: Array<IProducts> = [];
        if (snapshot.val() == null)
            return products;

        let list = snapshot.val();

        Object.keys(snapshot.val()).map((key: any) => {
            let products: any = list[key];

            products.push({
                key: key,
                productName: products.productName,
                brand: products.brand,
                description: products.description,
                qty: products.qty,
                rate: products.rate,
                amount: products.amount,
                subject: products.subject,
                orgName: products.orgName,
                user: { uid: products.user.uid, username: products.user.username }
            });
        });

        return products;
    }

    getProduct(snapshot: any, productKey: string): IProducts {
        let product: IProducts;

        if (snapshot.val() == null)
            return null;

        let snapshotProduct = snapshot.val();
        console.log(snapshotProduct);
        product = {
            key: productKey,
            productName: snapshotProduct.productName,
            brand: snapshotProduct.brand,
            description: snapshotProduct.description,
            qty: snapshotProduct.qty,
            rate: snapshotProduct.rate,
            amount: snapshotProduct.amount,
            subject: snapshotProduct.subject,
            orgName: snapshotProduct.orgName,
            user: snapshotProduct.user
        };

        return product;
    }

}