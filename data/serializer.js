const serializer = {
    station:{
        very_short: ['id', 'prefix', 'station_type_id'], //sem join, apenas para identificação de id, posto, tipo_id
        short: ['id', 'prefix', 'station_type_id', 'station_owner_id', 'operation_status', 'date_last_measurement'], //sem join, mais dados do posto
        all_clean: ['id', 'prefix', 'alt_prefix', 'station_type_id', 'station_owner_id', 'operation_status', 'transmission_gap', 'measurement_gap', 'date_last_measurement', 'public', 'battery_linear'], //sem join, todas as colunas
        default: ['station_prefixes.id', 'prefix', 'stations.name', 'station_types.name as station_type', 'stations.latitude', 'stations.longitude',  'cities.name as city', 'cities.cod_ibge', 'ugrhis.name as ugrhi', 'ugrhis.cod as ugrhi_cod', 'subugrhis.name as subugrhi', 'station_owners.name as station_owner', 'date_last_measurement'], //com join, colunas necessárias para identificação e localização do posto
    },
    measurement:{
        very_short: ['station_prefix_id', 'date_hour', 'value'], //sem join, apenas para identificação de id, posto, tipo_id
        short: ['station_prefix_id', 'station_prefixes.prefix', 'date_hour', 'value', 'read_value'],
        default: ['station_prefix_id', 'station_prefixes.prefix', 'date_hour', 'value', 'read_value', 'cities.id as city_id', 'cities.name as city', 'stations.latitude', 'stations.longitude', 'station_owners.name as station_owner']
    }
}

module.exports = serializer