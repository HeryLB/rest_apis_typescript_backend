import { Router } from "express"

const router = Router()

//routing
router.get("/",(req,res) => {
    res.json("Desde Get")
})

router.post("/",(req,res) => {
    res.json("Desde Post")
})

router.put("/",(req,res) => {
    res.json("Desde Put")
})

router.patch("/",(req,res) => {
    res.json("Desde Patch")
})

router.delete("/",(req,res) => {
    res.json("Desde delete")
})

export default router