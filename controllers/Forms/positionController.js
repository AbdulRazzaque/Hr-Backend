const Joi = require("joi");
const positionModule = require("../../model/Forms/positionModule");


const positionController ={

    async addPosition (req,res,next){
        const positionSchema = Joi.object({
            position:Joi.string().required()
        })

        const {error} = positionSchema.validate(req.body);

        if(error){
            return next(error)
        }

        const {position} = req.body;

        try {
            let addPosition = await positionModule.create({
                position
            });
            res.status(201).json({
                message:`successfully created`,
                addPosition
            })
        } catch (error) {
            return next(error)
        }
    },
    async updatePosition(req,res,next){
        console.log(req.body) 
        try {
            const positionSchema = Joi.object({
                position:Joi.string().required()
            })
    
            const {error} = positionSchema.validate(req.body);
    
            if(error){
                return next(error)
            }
    
            const {position} = req.body;
            console.log(position,'get req body')
            
                let updatePosition = await positionModule.findOneAndUpdate(
                    {_id:req.params.id},
                    {position},
                    {new:true}
                );
                if(!updatePosition){
                    return res.json({message:"Position not found"})
                }
                res.status(201).json({
                    message:`successfully created`,
                    updatePosition
                })
            }
        catch (error) {
            return next(error)
        }
    
    },
    async deletePosition (req,res,next){

        try {
            let deletePosition = await positionModule.findByIdAndRemove({
                _id:req.params.id
            })
            if(!deletePosition){
                return next(Error("Nothing to delete"))
            }
            res.json({message:"Delete successfully",deletePosition})
        } catch (error) {
            return next(error)
        }
    },

    async allPosition(req,res,next){
        try {
            let allPosition = await positionModule.find({}).sort({_id:-1})
            res.status(200).json({message:"All position list",allPosition})
        } catch (error) {
            return next(error)
        }
    }
}

module.exports = positionController