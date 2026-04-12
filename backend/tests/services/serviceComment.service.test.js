const serviceCommentService = require('../../src/services/serviceComment.service');
const serviceCommentModel = require('../../src/models/serviceComment.model');


jest.mock('../../src/models/serviceComment.model');

describe('ServiceComment Service', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createServiceComment', () => {
        it('meghívja a modell create függvényét', async () => {
            const commentData = { by_user: 1, service_id: 10, comment: 'Minden kész' };
            serviceCommentModel.create.mockResolvedValue({ service_comment_id: 1, ...commentData });

            const result = await serviceCommentService.createServiceComment(commentData);

            expect(serviceCommentModel.create).toHaveBeenCalledWith(commentData);
            expect(result.service_comment_id).toBe(1);
        });
    });

    describe('getAllServiceComments', () => {
        it('visszaadja az összes megjegyzést a modellből', async () => {
            const mockComments = [{ service_comment_id: 1, comment: 'Teszt' }];
            serviceCommentModel.findAll.mockResolvedValue(mockComments);

            const result = await serviceCommentService.getAllServiceComments();

            expect(serviceCommentModel.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockComments);
        });
    });

    describe('getServiceCommentById', () => {
        it('lekéri a konkrét megjegyzést ID alapján', async () => {
            serviceCommentModel.findById.mockResolvedValue({ service_comment_id: 5, comment: 'Szia' });

            const result = await serviceCommentService.getServiceCommentById(5);

            expect(serviceCommentModel.findById).toHaveBeenCalledWith(5);
            expect(result.comment).toBe('Szia');
        });
    });

    describe('updateServiceComment', () => {
        it('meghívja a modell update metódusát az új tartalommal', async () => {
            const updateData = { comment: 'Frissítve' };
            serviceCommentModel.update.mockResolvedValue({ service_comment_id: 1, ...updateData });

            const result = await serviceCommentService.updateServiceComment(1, updateData);

            expect(serviceCommentModel.update).toHaveBeenCalledWith(1, updateData);
            expect(result.comment).toBe('Frissítve');
        });
    });

    describe('deleteServiceComment', () => {
        it('meghívja a modell remove metódusát', async () => {
            serviceCommentModel.remove.mockResolvedValue(true);

            const result = await serviceCommentService.deleteServiceComment(1);

            expect(serviceCommentModel.remove).toHaveBeenCalledWith(1);
            expect(result).toBe(true);
        });
    });
    describe('ServiceComment Service - Edge Cases', () => {
        it('update: kezelnie kell, ha a módosítani kívánt komment nem létezik', async () => {
            
            serviceCommentModel.update.mockResolvedValue(null);

            const result = await serviceCommentService.updateServiceComment(999999, { comment: 'Friss' });

            expect(result).toBeNull();
        });

        it('delete: false-t kell adnia, ha már eleve törölték az ID-t', async () => {
            serviceCommentModel.remove.mockResolvedValue(false);

            const result = await serviceCommentService.deleteServiceComment(999);

            expect(result).toBe(false);
        });
    });
});

