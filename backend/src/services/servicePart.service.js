const servicePartModel = require("../models/servicePart.model");

exports.createServicePart = async (data) => {
    // Üzleti logika/javítás: Validáció
    if (!data.quantity || data.quantity <= 0) {
        throw new Error("A mennyiségnek nagyobbnak kell lennie 0-nál!");
    }
    if (data.unit_price < 0) {
        throw new Error("Az egységár nem lehet negatív!");
    }
    return await servicePartModel.create(data);
};

exports.getAllServiceParts = async () => {
    return await servicePartModel.findAll();
};

exports.getServicePartById = async (id) => {
    const part = await servicePartModel.findById(id);
    if (!part) throw new Error("A keresett szerviz-alkatrész nem található!");
    return part;
};

exports.updateServicePart = async (id, data) => {
    // Üzleti logika: Ha módosítunk, itt is ellenőrizzük a mennyiséget
    if (data.quantity !== undefined && data.quantity <= 0) {
        throw new Error("A módosított mennyiségnek pozitívnak kell lennie!");
    }
    const updated = await servicePartModel.update(id, data);
    if (!updated) throw new Error("Sikertelen frissítés: a rekord nem létezik!");
    return updated;
};

exports.deleteServicePart = async (id) => {
    const success = await servicePartModel.remove(id);
    if (!success) throw new Error("Sikertelen törlés: a rekord nem található!");
    return success;
};