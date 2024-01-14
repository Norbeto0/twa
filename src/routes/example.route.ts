
import Route from "./route";
import { validateObject } from "../middleware";
import { ExampleCalcRequestDto } from "../models";
import { exampleController } from "../controllers";
import path from "path";
import PrismaClient from '@prisma/client'

const prisma = new PrismaClient.PrismaClient()

export class ExampleRoute extends Route {
  setPrefix() {
    return "";
  }

  protected initializeRoutes(): void {
    this.cssRouter.get("/resources/css", (req, res) => {
      res.sendFile(path.resolve(__dirname + '/../output.css'));
    });

    this.viewRouter.get("/viewTest", (req, res) => {
      res.render("example/index");
    });

    this.viewRouter.get("/", (req, res) => {
      res.render("main/index");
    });

    this.apiRouter.get("/apiTest", (req, res) => {
      res.json({ message: "testing /app/apiTest" });
    });

    this.apiRouter.get("/api/products", async (req, res) => {
      const statMes = res.statusMessage ?? "OK";
      console.log(res.statusCode + " " + req.path + " " + statMes)
      try {
          const products = await prisma.sP_products.findMany({
              where: { flag: true }
          });

          let data = []
          products.forEach(obj => {
              data.push({ name: obj['name'], description: obj['description'], price: obj['price'], photo: obj['photo'].toString('base64') })
          });
          res.send(data);
      } catch (e) {
          console.error(e);
          res.status(500).send('An error occurred');
      } finally {
          await prisma.$disconnect()
      }
  })

    this.apiRouter.post("/calc", async (req, res) => {
      const data = req.body;
      await validateObject(ExampleCalcRequestDto, data, true, false);
      const responseData = exampleController.calc(data);
      res.json(responseData);
    });
  }
}