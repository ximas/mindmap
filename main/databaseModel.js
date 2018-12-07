'use-strict';

function DB () {
    this.ids = {} // key is entity name, val is list of ids;
    this.entities = {}; // key is entity name, val is list of obj
    this.store = {} //  key is entity name, val is obj of fields
    this.addEntity = (name, ent) => {
        this.entities[name] = ent;
        this.store[name] = [];
        this.ids[name] = 0;
    }
    this.makeValue = (ent) => {
        let retObj = {id:  this.ids[ent]};
        this.ids[ent] += 1;
        return retObj;
    }
    this.createValue = (ent, obj) => {
        let tmp = Object.assign(obj, {});
        this.store[ent].push(tmp)
    }

    this.getAll = (ent) => {
        let list = this.store[ent];
        let ret = [];
        for (rec of list) {
            let tmp = Object.assign({}, rec);
            ret.push(tmp);
        }
        return ret;
    }

    this.getWhere = (ent, prop, val) => {
        return db.getAll(ent).filter(rec => rec[prop] == val);
    }

    this.updateValue = (ent, obj) => {
        let index;
        let list = this.store[ent].filter((rec, i) => {
            index = i;
            return rec.id == obj.id;
        });
        if (list.length > 0) list[i] = Object.assign({}, obj);
    }

    this.removeOne = (ent, obj) => {
        this.store[ent] = db.getAll(ent).filter(rec => rec.id != obj.id);
    }
}

let db = new DB();
db.addEntity('Node',
    [
        'id',
        'name',
        'parent',
        'type',
        'soundSrc',
        'pinned',
        'desc',
        'imageSrc'
    ]
);

db.addEntity('Surface', ['id', 'desc']);
['Surface', 'Section', 'Element'].forEach(desc => {
    let item = db.makeValue('Surface')
    item.desc = desc;
    db.createValue('Surface', item);
});
