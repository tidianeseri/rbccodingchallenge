/* tslint:disable: variable-name */
import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

class CreateExchangeDto {
  @IsString()
  public stock!: string;

  @IsNumber()
  public quarter!: number;

  @IsDateString()
  public date!: Date;

  @IsNumber()
  public open!: number;

  @IsNumber()
  public high!: number;

  @IsNumber()
  public low!: number;

  @IsNumber()
  public close!: number;

  @IsNumber()
  public volume!: number;

  @IsNumber()
  public percent_change_price!: number;

  @IsOptional()
  @IsNumber()
  public percent_change_volume_over_last_wk: number | undefined;

  @IsOptional()
  @IsNumber()
  public previous_weeks_volume: number | undefined;

  @IsNumber()
  public next_weeks_open!: number;

  @IsNumber()
  public next_weeks_close!: number;

  @IsNumber()
  public percent_change_next_weeks_price!: number;

  @IsNumber()
  public days_to_next_dividend!: number;

  @IsNumber()
  public percent_return_next_dividend!: number;
}

export { CreateExchangeDto };
