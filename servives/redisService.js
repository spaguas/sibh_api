const redis = require('../config/redis')

const operations = {
    '=': (value, value2) => {
        if(value && value2){            
            return value.toString() === value2.toString()
        }
    },
    'in': (value, value2) => {        
        if(value){
            return value2.includes(value.toString())
        }
    }
}

const writeKey = async (key_id, obj, ex) => {

    let data = Object.entries(obj).flat()
    
    await redis.hset(key_id, data)

    if(ex){ //expiration time
        await redis.expire(key_id, ex);
    }

    return true
}

const scanKey = async (key) =>{
    let cursor = '0'
    let keys = []

    do {
        const [nextCursor, batchKeys] = await redis.scan(cursor, "MATCH", key);
        cursor = nextCursor;
        keys = keys.concat(batchKeys);
    } while (cursor !== "0");

    const data = await Promise.all(keys.map((key) => redis.hgetall(key)));
    return data
}

const filterData = (data, params) => {
    let filter = []
    let equalFields = ['prefix', 'station_type', 'station_type_id', 'city_id', 'cod_ibge', 'ugrhi_id', 'ugrhi_cod', 'ugrhi_name', 'subugrhi_id', 'station_owner', 'station_owner_id']

    equalFields.forEach(field=>{
        if(params[field]){
            filter.push({field:field, operator: '=', value: params[field]})
        }
    })    
    
    if(params['station_owner_ids']){
        filter.push({field:'station_owner_id', operator: 'in', value: params['station_owner_ids']})
    }

    
    if(filter.length > 0){
        return data.filter(item=>{
            let valid = []

            filter.forEach(filterOption=>{
                valid.push(operations[filterOption.operator](item[filterOption.field], filterOption.value))
            })            

            return !valid.includes(false)
        })
        
    }    

    return data

}

const clearDatabase = async () =>{
    await redis.flushdb();
}

module.exports = {
    writeKey,
    scanKey,
    clearDatabase,
    filterData
}