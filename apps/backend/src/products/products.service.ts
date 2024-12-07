import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import axios from 'axios';
import { CreateProductDto } from './dto/create-product.dto';
import { AddPriceDto } from './dto/add-price-dto';

const convertKatakanaToHiragana = (str: string) => {
  return str.replace(/[\u30a1-\u30f6]/g, function (match) {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
};

const convertHiraganaToKatakana = (str: string) => {
  return str.replace(/[\u3041-\u3096]/g, function (match) {
    const chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
};

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async registerProduct(body: CreateProductDto) {
    const { name, brandName, makerName, barcode, price, storeId } = body;

    const product = await this.prisma.product.create({
      data: {
        name,
        brandName,
        makerName,
        barcode,
        prices: {
          create: {
            price,
            store: {
              connect: {
                id: storeId,
              },
            },
          },
        },
      },
      include: {
        prices: {
          include: {
            store: true,
          },
        },
      },
    });

    return product;
  }

  async addPrice(barcode: string, body: AddPriceDto) {
    const { price, storeId } = body;

    const { id } = await this.prisma.product.findUnique({
      where: {
        barcode,
      },
    });

    return await this.prisma.productPrice.upsert({
      where: {
        productId_storeId: {
          productId: id,
          storeId,
        },
      },
      create: {
        price,
        product: {
          connect: {
            id,
          },
        },
        store: {
          connect: {
            id: storeId,
          },
        },
      },
      update: {
        price,
      },
    });
  }

  async findAll() {
    const products = await this.prisma.product.findMany({
      include: {
        prices: {
          orderBy: {
            price: 'asc',
          },
          include: {
            store: true,
          },
        },
      },
    });

    return products;
  }

  async searchByName(term: string, storeId: string) {
    console.log('検索動いてる');

    // 検索ワードのひらがなとカタカナを互いに変換する
    const hiraganaTerm = convertKatakanaToHiragana(term);
    const katakanaTerm = convertHiraganaToKatakana(term);

    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: hiraganaTerm,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: katakanaTerm,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: term,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        prices: {
          orderBy: {
            price: 'asc', // 価格を昇順に並び替え [0]が最安値になる
          },
          include: {
            store: true,
          },
        },
      },
      orderBy: {
        name: 'desc', // 商品名を降順に並び替え
      },
    });

    console.log('products', products);
    console.log('storeId', storeId);

    // 店舗指定がある場合、その店舗が最安値の商品のみをフィルタリング
    const filteredProducts =
      storeId !== 'all'
        ? products.filter(
            (product) =>
              product.prices.length > 0 &&
              product.prices[0]?.store.id === parseInt(storeId),
          )
        : products;

    // フロント表示用にデータの並びを加工する
    const optimizedProducts = filteredProducts.map((product) => {
      return {
        id: product.id,
        name: product.name,
        brandName: product.brandName,
        makerName: product.makerName,
        barcode: product.barcode,
        prices: product.prices ?? [],
        storeName: product.prices[0]?.store.name,
        updatedAt: product.prices[0]?.updatedAt,
      };
    });

    return optimizedProducts;
  }

  async findByBarcode(barcode: string) {
    console.log('バーコード読み取り動いてる');
    const product = await this.prisma.product.findUnique({
      where: { barcode },
      include: {
        prices: {
          include: {
            store: true,
          },
          orderBy: {
            price: 'asc',
          },
        },
      },
    });

    console.log('読み取ったJANコード：', barcode);
    console.log(product);

    if (product) {
      console.log('product is true');
      return {
        id: product.id,
        name: product.name,
        makerName: product.makerName,
        brandName: product.brandName,
        barcode: product.barcode,
        prices: product.prices ?? [],
        store: product.prices[0]?.storeId,
        isRegistered: true, // DBには無いProps True,Falseで登録処理の分岐を行う
      };
    }

    // const response = await axios.get(
    //   `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=${process.env.YAHOO_CLIENT_ID}&jan_code=${barcode}`,
    // );
    const response = await axios.get(
      `https://api.jancodelookup.com/?appId=${process.env.JANCODELOOKUP_APP_KEY}&query=${barcode}`,
    );

    console.log(response.data);
    console.log(response.data.product[0].itemImageUrl);
    if (!response.data.product) {
      throw new NotFoundException('商品が見つかりませんでした');
    }

    // JANコードの最後の一桁があっても無くても同じ商品であることがあるため
    // JANCODELOOKUPの情報を優先する
    const sameProduct = await this.prisma.product.findUnique({
      where: { barcode: response.data.product[0].codeNumber },
      include: {
        prices: {
          include: {
            store: true,
          },
          orderBy: {
            price: 'asc',
          },
        },
      },
    });

    // 商品情報を返すだけで、DBには保存しない
    return {
      makerName:
        response.data.product[0].makerName === ''
          ? '不明'
          : response.data.product[0].makerName,
      brandName:
        response.data.product[0].brandName === ''
          ? '不明'
          : response.data.product[0].brandName,
      name:
        response.data.product[0].itemName === ''
          ? '不明'
          : response.data.product[0].itemName,
      productImageUrl:
        response.data.product[0].itemImageUrl === ''
          ? '不明'
          : response.data.product[0].itemImageUrl,
      barcode: response.data.product[0].codeNumber,
      isRegistered: sameProduct ? true : false, // DBには無いProps True,Falseで登録処理の分岐を行う
    };
  }
}
