const serializer = {
    station:{
        very_short: ['id', 'prefix', 'station_type_id'], //sem join, apenas para identificação de id, posto, tipo_id
        short: ['id', 'prefix', 'station_type_id', 'station_owner_id', 'operation_status', 'date_last_measurement'], //sem join, mais dados do posto
        all_clean: ['id', 'prefix', 'alt_prefix', 'station_type_id', 'station_owner_id', 'operation_status', 'transmission_gap', 'measurement_gap', 'date_last_measurement', 'public', 'battery_linear'], //sem join, todas as colunas
        default: ['station_prefixes.id', 'alt_prefix', 'station_type_id', 'prefix', 'stations.name', 'station_types.name as station_type', 'stations.latitude', 'stations.longitude', 'cities.id as city_id',  'cities.name as city_name', 'cities.cod_ibge', 'ugrhis.id as ugrhi_id', 'ugrhis.name as ugrhi_name', 'ugrhis.cod as ugrhi_cod', 'subugrhis.name as subugrhi', 'station_owners.name as station_owner', 'station_owners.id as station_owner_id','date_last_measurement'], //com join, colunas necessárias para identificação e localização do posto,
        complete: ['station_prefixes.id', 'alt_prefix', 'prefix', 'station_type_id','stations.name', 'station_types.name as station_type', 
            'stations.id as station_id', 'stations.latitude', 'stations.longitude', 'cities.id as city_id',  'operation_status',
            'cities.name as city_name', 'cities.cod_ibge', 'ugrhis.id as ugrhi_id', 'ugrhis.name as ugrhi_name', 
            'ugrhis.cod as ugrhi_cod', 'subugrhis.name as subugrhi', 'station_owners.name as station_owner', 
            'station_owners.id as station_owner_id', 'date_last_measurement'], //com join, colunas necessárias para identificação e localização do posto + campos para análise,
            //  'CASE WHEN transmission_status > 100 THEN 0 ELSE 1 END AS price_category'
    },
    measurement:{
        very_short: ['station_prefix_id','station_prefixes.station_type_id'], //sem join, apenas para identificação de id, posto, tipo_id
        short: ['station_prefix_id', 'station_prefixes.prefix', 'station_prefixes.station_type_id'],
        default: ['station_prefix_id', 'station_prefixes.prefix', 'stations.name as station_name',  'station_prefixes.station_type_id', 'cities.id as city_id', 'cities.id as city_id', 'cities.cod_ibge as cod_ibge', 'stations.latitude', 'stations.longitude', 'station_owners.name as station_owner','transmission_types.name as transmission_type_name', 'measurement_gap', 'param_type'],
        complete: ['station_prefix_id', 'station_prefixes.prefix', 'stations.name as station_name',  'station_prefixes.station_type_id', 'cities.id as city_id', 'cities.name as city', 'cities.cod_ibge as cod_ibge', 'stations.latitude', 'stations.longitude', 'station_owners.name as station_owner', 'stations.ugrhi_id as ugrhi_id', 'ugrhis.name as ugrhi_name', 'ugrhis.cod as ugrhi_cod','subugrhis.name as subugrhi_name', 'subugrhis.id as subugrhi_id','subugrhis.cod as subugrhi_cod','transmission_types.name as transmission_type_name', 'measurement_gap', 'param_type']
    },
    city:{
        very_short: ['id', 'cod_ibge', 'name'], //sem join, apenas para identificação de id, posto, tipo_id
    },
    parameter:{
        short: ['id', 'parameterizable_type', 'parameterizable_id', 'values'],
        default: ['id',  'name', 'parameterizable_type', 'parameterizable_id', 'values', 'options', 'parameter_type_id']
    },
    alert:{
        default: ['id', 'alert_type_id', 'flag', 'date_hour', 'alertable_id', 'alertable_type', 'options', 'whatsapp_send', 'email_send', 'created_at', 'updated_at']
    },
    new_measurement:{
        default: ['station_prefix_id']
    },
    ugrhi:{
        default: ['id', 'cod', 'name']
    },
    subugrhi:{
        default: ['id', 'cod', 'name', 'ugrhi_id']
    },
    user:{
        default: ['id', 'email', 'name', 'encrypted_password']
    },
    hidroapp:{
        default: ['id', 'model_type', 'model_id', 'date_hour', 'rain', 'spi_6', 'dm', 'ndvi', 'temp', 'temp_max', 'temp_min']
    }
}

module.exports = serializer