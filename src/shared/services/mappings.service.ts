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
            let product: any = list[key];

            products.push({
                key: key,
                productName: product.productName,
                brand: product.brand,
                orgKey: product.key,
                description: product.description,
                qty: product.qty,
                rate: product.rate,
                amount: product.amount,
                subject: product.subject,
                user: { uid: product.user.uid, username: product.user.username }
            });
        });

        return products;
    }

    getProduct(snapshot: any, productKey: string): IProducts {

        let product: IProducts = {
            key: productKey,
            productName: snapshot.productName,
            brand: snapshot.brand,
            orgKey: snapshot.key,
            description: snapshot.description,
            qty: snapshot.qty,
            rate: snapshot.rate,
            amount: snapshot.amount,
            subject: snapshot.subject,
            user: snapshot.user
        };

        return product;
    }

}