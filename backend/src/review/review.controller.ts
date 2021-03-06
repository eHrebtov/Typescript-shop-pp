import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';

@ApiTags('Review')
@Controller('api/review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @ApiOperation({ summary: 'Create review' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @UseGuards(JwtAuthGuard)
  @Post('/:productId')
  async createReview(
    @Body(new ValidationPipe()) reviewDto: CreateReviewDto,
    @Req() req,
    @Param(
      'productId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    productId: number,
  ) {
    return this.reviewService.createReview(reviewDto, req.user.id, productId);
  }

  @ApiOperation({ summary: 'Get reviews by product id' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('/:productId')
  async getReviewsByProductId(
    @Query('page') page: number,
    @Param(
      'productId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    productId: number,
  ) {
    return this.reviewService.getReviewsByProductId(productId, page);
  }

  @ApiOperation({ summary: 'Delete review' })
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(JwtAuthGuard)
  @Delete('/:productId/:reviewId')
  async deleteReview(
    @Req() req,
    @Param(
      'productId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    productId: number,
    @Param(
      'reviewId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    reviewId: number,
  ) {
    return this.reviewService.deleteReview(productId, reviewId, req.user.id);
  }
}
