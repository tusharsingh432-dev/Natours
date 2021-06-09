class APIFeatures {
    constructor(query, queryParams) {
        this.query = query;
        this.queryParams = queryParams;
    }
    filter() {
        const queryParamsFilter = { ...this.queryParams };
        const excludeParams = [`page`, `sort`, `limit`, `fields`];
        excludeParams.forEach(el => delete queryParamsFilter[el]);

        let queryStr = JSON.stringify(queryParamsFilter);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => {
            return `$${match}`
        });

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }
    sort() {
        if (this.queryParams.sort) {
            const sortBy = this.queryParams.sort.split(`,`).join(` `);
            this.query.sort(sortBy);
        } else {
            this.query.sort(`-createdAt`);
        }
        return this;
    }
    limitFields() {
        if (this.queryParams.fields) {
            const fields = this.queryParams.fields.split(`,`).join(` `);
            this.query.select(fields);
        } else {
            this.query.select(`-__v`);
        }
        return this;
    }

    pagination() {
        const page = this.queryParams.page * 1 || 1;
        const limit = this.queryParams.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query.skip(skip).limit(limit);

        return this;
    }

}

module.exports = APIFeatures;