const axios = require('axios')
const fs = require('fs')
const db = require('./services/db')
const get = params => axios(`https://parallelum.com.br/fipe/api/v1/carros/marcas${params || ''}`)

const REDUCER = (x, y) => x.concat(y)

const brandFac = (obj) => ({
    id: obj.codigo.toString(),
    name: obj.nome
})

const modelFac = (obj, brandId) => {
    return obj.modelos.map(model => {
        return {
            id: model.codigo.toString(),
            brand_id: brandId,
            name: model.nome
        }
    })
}

//24192
const yearFac = (obj, modelId) => {
    return obj.map(year => {
        return {
            id: year.codigo.toString(),
            model_id: modelId,
            name: year.nome.split(' ')[0] || obj.nome,
        }
    })
}

//24192
const carsFac = (car, brandId, modelId, yearId) => {
    return {
        "id": car.CodigoFipe,
        "brand_id": brandId,
        "model_id": modelId,
        "year_id": yearId,
        "fuel": car.Valor,
        "monthRef": car.MesReferencia,
        "typeVehicle": car.TipoVeiculo,
        "sigleFuel": car.SiglaCombustivel
    }
}

const getBrands = async () => {
    return new Promise((resolve, reject) => {
        get()
            .then(resp => {
                return resolve(resp.data.map(brandFac))
            })
            .catch(err => {
                return reject(err)
            })
    })
}

const getModel = async (brand) => {
    try {
        const result = await get(`/${brand.id}/modelos`)
        if (result.data) {
            console.log(result.data)
            const model = modelFac(result.data, brand.id)
            return model
        } else {
            return { 'ERROR': true, 'brand_id': brand.id }
        }
    } catch (err) {
        return getModel(brand)
    }
}

const getAllModels = async (brands) => {
    return new Promise((resolve, reject) => {
        Promise
            .all(brands.map(getModel))
            .then(result => {
                return resolve(result.reduce(REDUCER))
            }).catch(err => {
                getAllModels(brands)
                    .then(result => {
                        return resolve(result.reduce(REDUCER))
                    })
            })
    })
}

const getYear = async (model, i) => {
    try {
        const result = await get(`/${model.brand_id}/modelos/${model.id}/anos`)
        if (result.data && !result.data.some(hasNull)) {
            console.log(result.status, '      index:', i)
            // console.log(result.data)
            return yearFac(result.data, model.id)
        } else {
            return getYear(model, i)
        }
    } catch (err) {
        return getYear(model, i)
    }
}

const getAllYears = async (models) => {
    return new Promise((resolve, reject) => {
        Promise
            .all(models.map(getYear))
            .then(result => {
                return resolve(result.reduce(REDUCER))
            })
    })
}

const getInfoCar = async (brands, models, years) => {
    let infoCar = []

    brands.map(brand => {
        models.map(model => {
            years.map(year => {
                infoCar.push({
                    brandId: brand.id,
                    modelId: model.id,
                    yearId: year.id,
                    url: url(`${brand.id}/modelos/${model.id}/anos/${year.id}`)
                })
            })
        })
    })

    console.log(infoCar)
    return infoCar;
}

const getCar = (url) => {
    return get(url)
        .then(result => {
            if (result.data) {
                // console.log(result.data)
                let urlSplit = url.split('/')
                return carsFac(result.data, urlSplit[1], urlSplit[3], urlSplit[5]);
            } else {
                return getCar(url)
            }
        }).catch(err => {
            return getCar(url)
        })
}

const save = async (name, content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(name, `module.exports = ${JSON.stringify(content)}`, (err, data) => {
            if (err) {
                print('ERROR IN SAVE:   ' + name)
                return reject(err)
            }

            print('SAVED WITH SUCCESS:  ' + name)
            return resolve(data)
        })
    })
}

const hasNull = (data, i) => {
    if (Array.isArray(data)) {
        data.map(hasNull)
    }

    return data === null
}

const getUrls = () => {
    const models = require('./api/models_API')
    const years = require('./api/years_API')

    let urls = []

    models.map(model =>
        years.filter(year => year.model_id == model.id)
            .map(result =>
                urls.push(`/${model.brand_id}/modelos/${model.id}/anos/${result.id}`)
            )
    )

    return urls
}

const handleRequest = async (array) => {

    let blockSize = 100,
        totalSize = array.length / blockSize,
        init = 0,
        final = blockSize;

    for (let i = 0; i < totalSize; i++ , init += blockSize, final += blockSize) {

        console.log(`BLOCK INIT: ${init}             BLOCK FINAL: ${final}`)

        let blockArray = array.slice(init, final)

        const promises = blockArray.map(url => getCar(url))


        const result = await Promise.all(promises)
        const data = await db.cars.insertMany(result)
        console.log(data)
    }
}

const print = (print) => {
    console.log('')
    console.log('###################################################')
    console.log('')

    console.log(`   ${print}                      `)

    console.log('')
    console.log('###################################################')
    console.log('')
}

const createFileArray = (name, array) => {
    let file = fs.createWriteStream(name);

    file.on('error', (err) => print('ERROR IN SAVE:   ' + name))
    file.write('module.exports = [')
    array.forEach((value, i) => {
        if (i == array.length)
            file.write("'" + value + "'\n")
        file.write("'" + value + "', \n")
    })
    file.write(']')
    file.end();

    print('SAVED WITH SUCCESS:  ' + name)
}

const saves = async (brans, models, years) => {
    await save('api/brands_API.js', brands)
    await save('api/models_API.js', models)
    await save('api/years_API.js', year)
    await save('api/cars_API.js', cars)
}

const start = async () => {
    handleRequest(require('./api/urls_api'))
    // console.log(getUrls().join(', \n'))
    // createFileArray('api/urls_api.js', getUrls())

    // const brands = await getBrands()
    // const models = await getAllModels(require('./api/brands_API'))
    // const year = await getAllYears(require('./api/models_API'))
    // const cars = await getAllCars()
}

